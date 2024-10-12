const PostedThread = require('../../../Domains/thread/entities/PostedThread')
const PostThread = require('../../../Domains/thread/entities/PostThread')
const ThreadRepository = require('../../../Domains/thread/ThreadRepository')
const AddThreadUseCase = require('../AddThreadUseCase')

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: "Senin",
            body: "Hari ini adalah hari senin",
            owner: "user-123",
            createdAt : '2024-12-11'
        }

        const mockPostedThread =  new PostedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: useCasePayload.owner
        })

        const mockThreadRepository = new ThreadRepository()

        mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockPostedThread))

        const getThreadUseCase = new AddThreadUseCase({threadRepository: mockThreadRepository})

        // Action
        const postedThread = await getThreadUseCase.execute(useCasePayload)

        // Assert
        expect(postedThread).toStrictEqual(new PostedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: useCasePayload.owner
        }))

        expect(mockThreadRepository.addThread).toBeCalledWith(new PostThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: useCasePayload.owner,
            createdAt : useCasePayload.createdAt
        }))
    })
})