const PostThread = require('../PostThread')

describe('a PostThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'adada',
      body: 'adaad'
    }

    // Action and Assert
    expect(() => new PostThread(payload)).toThrowError(
      'POST_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: 'adaad',
      owner: 2331
    }

    // Action and Assert
    expect(() => new PostThread(payload)).toThrowError(
      'POST_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })
  it('should create postThread object correctyly', () => {
    // Arrange
    const payload = {
      title: 'Senin',
      body: 'Hari ini hari senin',
      owner: 'user-12131'
    }

    // Action
    const { title, body, owner } = new PostThread(payload)

    // Assert
    expect(title).toEqual(payload.title)
    expect(body).toEqual(payload.body)
    expect(owner).toEqual(payload.owner)
  })
})
