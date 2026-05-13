import {defineArrayMember, defineType} from 'sanity'

export const buttonsType = defineType({
  name: 'buttons',
  title: 'Buttons',
  type: 'array',
  of: [defineArrayMember({type: 'buttonItem'})],
})
