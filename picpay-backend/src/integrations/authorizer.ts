export async function authorizeTransaction() {
    try {
      const response = await fetch('https://util.devi.tools/api/v2/authorize')
  
      const data = await response.json()
  
      if (data.status !== 'success') {
        return false
      }
  
      return data.data.authorization === true
  
    } catch (error) {
      return false
    }
  }