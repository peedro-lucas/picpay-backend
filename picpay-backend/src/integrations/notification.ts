export async function sendNotification() {
    try {
      const response = await fetch('https://util.devi.tools/api/v1/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Transação realizada com sucesso',
        }),
      })
  
      let data = null
  
      try {
        data = await response.json()
      } catch {
        // ignora erro de parse
      }
  
      console.log('NOTIFICATION RESPONSE:', data)
  
      // sucesso real
      if (response.ok && data?.status === 'success') {
        return true
      }
  
      return false
  
    } catch (error) {
      console.error('Erro notificação:', error)
      return false
    }
  }