'use client'

import {useMemo, useState} from 'react'
import type {Block} from './types'

type Field = NonNullable<Block['formFields']>[number]
type FormValues = Record<string, string | boolean>

type SubmitState =
  | {status: 'idle'}
  | {status: 'submitting'}
  | {status: 'success'; message: string}
  | {status: 'error'; message: string}

const defaultFields: Array<Field> = [
  {name: 'name', label: 'Name', fieldType: 'text', required: true, width: 'half'},
  {name: 'email', label: 'Email', fieldType: 'email', required: true, width: 'half'},
  {name: 'message', label: 'Message', fieldType: 'textarea', required: true, width: 'full'},
]

function safeName(name: string | undefined, fallback: string) {
  if (!name || !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) return fallback
  return name
}

function fieldId(blockKey: string, fieldName: string) {
  return `contact-${blockKey}-${fieldName}`
}

function normalizeRedirectPath(path: string | undefined) {
  const trimmed = path?.trim()
  if (!trimmed) return null
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

export function ContactFormClient({block}: {block: Block}) {
  const fields = useMemo(() => {
    const built = block.formFields?.filter((field) => Boolean(field?.label && field?.name))
    return built && built.length > 0 ? built : defaultFields
  }, [block.formFields])

  const initialValues = useMemo<FormValues>(() => {
    return fields.reduce<FormValues>((acc, field, index) => {
      const name = safeName(field.name, `field_${index}`)
      acc[name] = field.fieldType === 'checkbox' ? false : ''
      return acc
    }, {})
  }, [fields])

  const [values, setValues] = useState<FormValues>(initialValues)
  const [botField, setBotField] = useState('')
  const [submitState, setSubmitState] = useState<SubmitState>({status: 'idle'})

  const errorMessage = block.errorMessage ?? 'Something went wrong. Please try again in a moment.'
  const successMessage =
    block.successMessage ?? 'Thanks! We received your message and will get back to you shortly.'

  const handleInputChange = (name: string, value: string | boolean) => {
    setValues((prev) => ({...prev, [name]: value}))
  }

  const validate = () => {
    for (let index = 0; index < fields.length; index += 1) {
      const field = fields[index]
      const name = safeName(field.name, `field_${index}`)
      const rawValue = values[name]
      const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue

      if (field.required) {
        if (field.fieldType === 'checkbox' && value !== true) {
          return `${field.label || name} is required.`
        }
        if (typeof value === 'string' && value.length === 0) {
          return `${field.label || name} is required.`
        }
      }

      if (field.fieldType === 'email' && typeof value === 'string' && value.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return `${field.label || name} must be a valid email.`
        }
      }
    }

    return null
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (!block._key) {
      setSubmitState({status: 'error', message: 'Form is not configured correctly yet.'})
      return
    }

    const validationMessage = validate()
    if (validationMessage) {
      setSubmitState({status: 'error', message: validationMessage})
      return
    }

    setSubmitState({status: 'submitting'})

    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          blockKey: block._key,
          values,
          botField,
          sourcePath: typeof window !== 'undefined' ? window.location.pathname : '/',
        }),
      })

      const payload = (await response.json()) as {ok?: boolean; message?: string}

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || errorMessage)
      }

      const redirectPath = normalizeRedirectPath(block.successRedirectPath)
      if (redirectPath && typeof window !== 'undefined') {
        window.location.assign(redirectPath)
        return
      }

      setSubmitState({status: 'success', message: successMessage})
      setValues(initialValues)
      setBotField('')
    } catch (error) {
      const message = error instanceof Error ? error.message : errorMessage
      setSubmitState({status: 'error', message})
    }
  }

  return (
    <form className="mt-5 grid grid-cols-2 gap-3" onSubmit={onSubmit} noValidate>
      {fields.map((field, index) => {
        const name = safeName(field.name, `field_${index}`)
        const id = fieldId(block._key ?? 'block', name)
        const isHalf = field.width === 'half'
        const spanClass = isHalf ? 'col-span-2 md:col-span-1' : 'col-span-2'
        const value = values[name]
        const baseInputClass =
          'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900/10 transition focus:ring-2'

        return (
          <div key={field._key ?? id} className={spanClass}>
            {field.fieldType === 'checkbox' ? (
              <label className="inline-flex items-center gap-2 text-sm text-zinc-800" htmlFor={id}>
                <input
                  id={id}
                  name={name}
                  type="checkbox"
                  checked={value === true}
                  onChange={(event) => handleInputChange(name, event.target.checked)}
                />
                <span>
                  {field.label}
                  {field.required ? ' *' : ''}
                </span>
              </label>
            ) : (
              <>
                <label className="mb-1 block text-sm font-medium text-zinc-800" htmlFor={id}>
                  {field.label}
                  {field.required ? ' *' : ''}
                </label>
                {field.fieldType === 'textarea' ? (
                  <textarea
                    id={id}
                    name={name}
                    rows={5}
                    value={typeof value === 'string' ? value : ''}
                    required={Boolean(field.required)}
                    placeholder={field.placeholder || undefined}
                    className={baseInputClass}
                    onChange={(event) => handleInputChange(name, event.target.value)}
                  />
                ) : field.fieldType === 'select' ? (
                  <select
                    id={id}
                    name={name}
                    value={typeof value === 'string' ? value : ''}
                    required={Boolean(field.required)}
                    className={baseInputClass}
                    onChange={(event) => handleInputChange(name, event.target.value)}
                  >
                    <option value="">Select an option</option>
                    {(field.options ?? []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={id}
                    name={name}
                    type={field.fieldType === 'email' || field.fieldType === 'tel' ? field.fieldType : 'text'}
                    value={typeof value === 'string' ? value : ''}
                    required={Boolean(field.required)}
                    placeholder={field.placeholder || undefined}
                    className={baseInputClass}
                    onChange={(event) => handleInputChange(name, event.target.value)}
                  />
                )}
              </>
            )}
            {field.helpText ? <p className="mt-1 text-xs text-zinc-500">{field.helpText}</p> : null}
          </div>
        )
      })}

      <div className="hidden" aria-hidden="true">
        <label htmlFor="company_name">Company</label>
        <input
          id="company_name"
          name="company_name"
          autoComplete="off"
          tabIndex={-1}
          value={botField}
          onChange={(event) => setBotField(event.target.value)}
        />
      </div>

      <div className="col-span-2">
        <button
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          type="submit"
          disabled={submitState.status === 'submitting' || !block._key}
        >
          {submitState.status === 'submitting' ? 'Sending...' : block.submitLabel ?? 'Send Message'}
        </button>
      </div>

      {submitState.status === 'success' ? (
        <p className="col-span-2 text-sm text-emerald-700">{submitState.message}</p>
      ) : null}
      {submitState.status === 'error' ? (
        <p className="col-span-2 text-sm text-red-700">{submitState.message}</p>
      ) : null}
    </form>
  )
}
