export type DocumentDeskType = Document<unknown, any, Desk> &
  Omit<
    Desk & {
      _id: Types.ObjectId;
    },
    never
  >;
