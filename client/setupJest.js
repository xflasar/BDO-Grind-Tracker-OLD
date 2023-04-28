require('jest-fetch-mock').enableMocks()

import '@testing-library/jest-dom'
global.fetch = require('jest-fetch-mock')