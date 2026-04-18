export type DBCFieldType =
  | 'int8'
  | 'int16'
  | 'int32'
  | 'int64'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'uint64'
  | 'float'
  | 'bool'
  | 'string'
  | 'stringref'
  | 'loc'
  | 'flags'
  | 'enum'
  | 'iref'
  | 'unknown'

export type DBCCategory =
  | 'spell'
  | 'item'
  | 'creature'
  | 'character'
  | 'world'
  | 'ui'
  | 'sound'
  | 'achievement'
  | 'pvp'
  | 'quest'
  | 'vehicle'
  | 'misc'

export interface DBCEnumValue {
  value: number | string
  name: string
  description?: string
}

export interface DBCFlagValue {
  bit: number
  name: string
  description?: string
}

export interface DBCField {
  index: number
  endIndex: number
  name: string
  type: DBCFieldType
  rawType: string
  arrayLength?: number
  fkTarget?: string
  description: string
  enumValues?: DBCEnumValue[]
  flagValues?: DBCFlagValue[]
}

export interface DBC {
  name: string
  filename: string
  category: DBCCategory
  description: string
  fields: DBCField[]
  fieldCount: number
  related: string[]
  documentationUrl: string
  patch: string
  memoryAddress?: string
  bookPage?: number
}
