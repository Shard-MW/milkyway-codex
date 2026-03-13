export interface ApiParameter {
  name: string
  type: string
  description: string
  optional: boolean
}

export interface ApiReturn {
  name: string
  type: string
  description: string
}

export interface CodeExample {
  title: string
  code: string
  language: string
}

export interface ApiFunction {
  name: string
  description: string
  signature: string
  parameters: ApiParameter[]
  returns: ApiReturn[]
  examples: CodeExample[]
  tags: string[]
  category: string
  subcategory: string
  protected: boolean
  hwEvent: boolean
  related: string[]
  patch: string
  documentationUrl: string
  memoryAddress?: string
}

export interface WowEvent {
  name: string
  description: string
  parameters: ApiParameter[]
  category: string
  related: string[]
  patch: string
  documentationUrl: string
}

export interface DataType {
  name: string
  description: string
  values: DataTypeValue[]
  related: string[]
}

export interface DataTypeValue {
  name: string
  value: string
  description: string
}

export interface WidgetMethod {
  name: string
  signature: string
  description: string
}

export interface WidgetScriptHandler {
  name: string
  signature: string
  description: string
  parameters: ApiParameter[]
}

export interface Widget {
  name: string
  description: string
  inherits: string[]
  methods: WidgetMethod[]
  inheritedMethods: WidgetMethod[]
  scriptHandlers: WidgetScriptHandler[]
  category: 'frame' | 'region' | 'animation' | 'abstract'
}

export interface CVar {
  name: string
  defaultValue: string
  description: string
  category: string
}

export interface SecureTemplateAttribute {
  name: string
  values: string[]
  description: string
}

export interface SecureTemplate {
  name: string
  description: string
  attributes: SecureTemplateAttribute[]
  examples: CodeExample[]
}

export interface SearchResult {
  type: 'function' | 'event' | 'datatype' | 'widget' | 'cvar' | 'secure_template'
  name: string
  description: string
  category: string
  tags: string[]
  protected: boolean
}

export type CategoryMap = Record<string, string[]>
