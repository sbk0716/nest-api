export const Schema = {
  public: 'public',
  private: 'private',
  todoist: 'todoist',
};

export type SchemaType = typeof Schema[keyof typeof Schema];
