import handlebars from 'express-handlebars';

export const configureHandlebars = () => {
  const hbs = handlebars.create({
    // Custom helpers
    helpers: {
      multiply: (a, b) => a * b,
    },
  });

  return hbs.engine;
};
