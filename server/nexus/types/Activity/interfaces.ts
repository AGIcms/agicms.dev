export enum ActivityType {
  UserCreated = 'UserCreated',
  UrlChanged = 'UrlChanged',
  // Предложенный УРЛ для автоматического перехода
  SuggestUrl = 'SuggestUrl',
  SendMessage = 'SendMessage',
  MindLog = 'MindLog',
  ToolCall = 'ToolCall',
  StdOut = 'StdOut',
}
