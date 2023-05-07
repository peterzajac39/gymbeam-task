export const schema = {
    products: {
      errorMessage: 'Invalid products param, must be array of strings',
      isArray: true,
    },
    start: {
        errorMessage: 'Must be object in format x,y,z with numbers',
        isObject: true,
    },
    "start.x": {
        isNumeric: {
            errorMessage: 'start in x coordinate must be in format number',
            bail: true
          }
    },
    "start.y": {
        isNumeric: {
            errorMessage: 'start in y coordinate must be in format number',
            bail: true
          }
    },
    "start.z": {
        isNumeric: {
            errorMessage: 'start in z coordinate must be in format number',
            bail: true
          }
    }
}