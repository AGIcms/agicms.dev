export enum ActivityType {
  UserCreated = 'UserCreated',
  UrlChanged = 'UrlChanged',
  SendMessage = 'SendMessage',
  MindLog = 'MindLog',
  ToolCall = 'ToolCall',
  StdOut = 'StdOut',

  // Предложенный УРЛ для автоматического перехода
  SuggestUrl = 'SuggestUrl',
}
