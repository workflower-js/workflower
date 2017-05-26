const path = require('path')

const ROOT_PATH = path.resolve(__dirname, '..')
exports.SRC_PATH = path.resolve(ROOT_PATH, 'src')
exports.DIST_PATH = path.resolve(ROOT_PATH, 'dist')
exports.TEST_PATH = path.resolve(ROOT_PATH, 'test')
exports.MODULE_PATH = path.resolve(ROOT_PATH, 'node_modules')
