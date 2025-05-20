export type AttributeObject<Type> = {
  [property in keyof Type]: Type[property];
};
