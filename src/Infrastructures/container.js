/* istanbul ignore file */

const { createContainer } = require('instances-container')

// external agency
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc)
const UserRepository = require('../Domains/users/UserRepository')
const PasswordHash = require('../Applications/security/PasswordHash')
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres')
const BcryptPasswordHash = require('./security/BcryptPasswordHash')

// use case
const AddUserUseCase = require('../Applications/use_case/UserAddUseCase')
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager')
const JwtTokenManager = require('./security/JwtTokenManager')
const LoginUserUseCase = require('../Applications/use_case/UserLoginUseCase')
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository')
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres')
const LogoutUserUseCase = require('../Applications/use_case/UserLogoutUseCase')
const RefreshAuthenticationUseCase = require('../Applications/use_case/AuthenticationRefreshUseCase')
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres')
const ThreadRepository = require('../Domains/threads/ThreadRepository')
const AddThreadUseCase = require('../Applications/use_case/ThreadAddUseCase')
const AddCommentUseCase = require('../Applications/use_case/CommentAddUseCase')
const CommentRepository = require('../Domains/comments/CommentRepository')
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres')
const DeleteCommentUseCase = require('../Applications/use_case/CommentDeleteUseCase')
const GetDetailThreadUseCase = require('../Applications/use_case/ThreadGetDetailUseCase')
const RepliesRepository = require('../Domains/replies/RepliesRepository')
const RepliesRepositoryPostgres = require('./repository/RepliesRepositoryPostgres')
const RepliesAddUseCase = require('../Applications/use_case/RepliesAddUseCase')
const RepliesDeleteuseCase = require('../Applications/use_case/RepliesDeleteUseCase')

// creating container
const container = createContainer()

// registering services and repository
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        }
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt
        }
      ]
    }
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token
        }
      ]
    }
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: CommentRepository.name,
    Class: CommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: RepliesRepository.name,
    Class: RepliesRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  }
])

// registering use cases
container.register([
  {
    key: RepliesDeleteuseCase.name,
    Class: RepliesDeleteuseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'repliesRepository',
          internal: RepliesRepository.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: RepliesAddUseCase.name,
    Class: RepliesAddUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'repliesRepository',
          internal: RepliesRepository.name
        },
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: GetDetailThreadUseCase.name,
    Class: GetDetailThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        },
        {
          name: 'repliesRepository',
          internal: RepliesRepository.name
        }
      ]
    }
  },
  {
    key: DeleteCommentUseCase.name,
    Class: DeleteCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'commentRepository',
          internal: CommentRepository.name
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        }
      ]
    }
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        }
      ]
    }
  }
])

module.exports = container
