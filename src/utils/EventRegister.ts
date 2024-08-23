interface Ref {
  name: string
  callback: (data?: any) => void
}

interface Listener {
  count: number
  refs: Record<string, Ref>
}

export class EventRegister {
  static _Listeners: Listener = {
    count: 0,
    refs: {}
  }

  static addListener(eventName: string, callback: () => void) {
    if (typeof eventName === 'string' && typeof callback === 'function') {
      EventRegister._Listeners.count++
      const eventId = 'event-' + EventRegister._Listeners.count

      EventRegister._Listeners.refs[eventId] = { name: eventName, callback }
      return eventId
    }
    return null
  }

  static removeListener(id: string) {
    if (typeof id === 'string') return delete EventRegister._Listeners.refs[id]
    return false
  }

  static removeAllListeners() {
    for (const _id of Object.keys(EventRegister._Listeners.refs)) {
      delete EventRegister._Listeners.refs[_id]
    }
  }

  static emitEvent(eventName: string, data: any) {
    for (const _id of Object.keys(EventRegister._Listeners.refs)) {
      if (
        EventRegister._Listeners.refs[_id] &&
        eventName === EventRegister._Listeners.refs[_id].name
      ) {
        EventRegister._Listeners.refs[_id].callback(data)
      }
    }
  }

  static on(eventName: string, callback: () => void) {
    return EventRegister.addListener(eventName, callback)
  }

  static rm(id: string) {
    return EventRegister.removeListener(id)
  }

  static rmAll() {
    return EventRegister.removeAllListeners()
  }

  static emit(eventName: string, data: any) {
    EventRegister.emitEvent(eventName, data)
  }

}
