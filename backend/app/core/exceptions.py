class AppException(Exception):
    def __init__(self, status_code: int, detail: str): self.status_code=status_code; self.detail=detail; super().__init__(detail)
class AuthenticationError(AppException):
    def __init__(self, detail='Invalid authentication credentials'): super().__init__(401,detail)
class AuthorizationError(AppException):
    def __init__(self, detail='Not authorized'): super().__init__(403,detail)
class NotFoundError(AppException):
    def __init__(self, detail='Resource not found'): super().__init__(404,detail)
class ConflictError(AppException):
    def __init__(self, detail='Resource conflict'): super().__init__(409,detail)
class ValidationError(AppException):
    def __init__(self, detail='Invalid request'): super().__init__(422,detail)
