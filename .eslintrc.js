module.exports = {
    "env": {
        "commonjs": true,
        "node": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "semi": ["error", "always"],
        "quotes": ["error", "double"],
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],

        "prefer-const": true,
        "no-cond-assign": ["error", "always"]
    },
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    }
};