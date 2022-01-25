import { getWeather } from '@weather/base/services/WeatherService'
import { Router } from 'express'

const weather = Router()

weather.get('/:latlng', async (req, res) => {
  try {
    const [lat, lng] = req.params.latlng.split(',')
    const nlat = Number(lat)
    const nlng = Number(lng)
    const results = await getWeather(nlat, nlng)

    res.status(200).json(results)
  } catch (err) {
    res.status(500).json({ error: (err as Error)?.message })
  }
})

export default weather
