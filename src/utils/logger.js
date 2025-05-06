export function formatLogEntry(message, type = "system") {
    return {
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    };
  }