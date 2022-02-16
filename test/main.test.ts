import { welcome } from '../components'

describe('index', () => {
  test('demo part', () => {
    console.log = jest.fn()
    welcome()
    expect(console.log).toHaveBeenCalledWith('hello world')
  })
})
