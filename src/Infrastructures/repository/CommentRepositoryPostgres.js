const CommentRepository = require('../../Domains/comments/CommentRepository')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const PostedComment = require('../../Domains/comments/entities/PostedComment')
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')

class CommentRepositoryPostgres extends CommentRepository{
    constructor(pool, idGenerator){
        super()
        this._pool = pool
        this._idGenerator = idGenerator
    }

    async addComment(postComment){
        const {content, owner, createdAt, threadsId, isDelete} = postComment
        const id = `comment-${this._idGenerator()}`
        const query = `INSERT INTO comments VALUES ('${id}', '${content}', '${owner}', '${threadsId}', '${isDelete}', '${createdAt}') RETURNING id, content, owner`
        const result = await this._pool.query(query)
        return new PostedComment({...result.rows[0]})
    }

    async checkCommentIsExist(commentId){
        const query = `SELECT * FROM comments WHERE id = '${commentId}'`
        const result = await this._pool.query(query)
        if (result.rowCount === 0) {
            throw new NotFoundError('Comment tidak ada')
        }
    }

    async checkCommentOwner(commentId, commentOwnerId){
        const query = `SELECT * FROM comments WHERE id = '${commentId}' AND owner = '${commentOwnerId}'`
        const result = await this._pool.query(query)
        if (result.rowCount === 0) {
            throw new AuthorizationError('Comment tidak bisa dihapus, sebab bukan pemilik')
        }
    }

    async deleteComment(commentId){
        const query = `UPDATE comments SET is_delete = true WHERE id = '${commentId}'`
        await this._pool.query(query)
    }

    async getCommentInThread(threadId){
        const query = `SELECT c.id, u.username ,c."createdAt" as date, c."content", c.is_delete FROM comments c  right join threads t on c.threads_id = t.id right join users u on c."owner" = u.id WHERE t.id  = '${threadId}' order by "createdAt" asc ;`
        const result = await this._pool.query(query)
        let comments = result.rows
        comments.forEach(comment => {
            if (comment.is_delete) {
                comment.content = '**komentar telah dihapus**'
            }
        })
        return comments
    }
}

module.exports = CommentRepositoryPostgres;