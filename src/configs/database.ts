export const Schema = {
  public: 'public',
  private: 'private',
  todoist: 'todoist',
};

export type SchemaType = typeof Schema[keyof typeof Schema];

export const Table = {
  user: 'user_table',
  todo: 'todo_table',
};

export type TableType = typeof Table[keyof typeof Table];
