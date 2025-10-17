module.exports = {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['> 1%', 'last 2 versions']
          },
          modules: false // Keep ES6 modules for webpack to handle
        }
      ]
    ]
  };