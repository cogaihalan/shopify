// eslint-disable-next-line import/no-unresolved
import pluralize from 'https://cdn.skypack.dev/pluralize@8.0.0'

if (!customElements.get('countdown-timer')) {
  customElements.define(
    'countdown-timer',
    // eslint-disable-next-line no-undef
    class CountdownTimer extends window.BAO.CustomElement() {
      _requiredData = ['endDate']
      _requiredElements = [
        'days',
        'hours',
        'minutes',
        'seconds',
        'dayText',
        'hourText',
        'minuteText',
        'secondText',
      ]

      constructor () {
        super()
        this.checkRequirements()
        this.initialize()
      }

      checkRequirements () {
        this.checkRequiredData()
        this.checkRequiredElements()
      }

      checkRequiredData () {
        this._requiredData.forEach(requiredDataKey => {
          if (!this.hasData(requiredDataKey)) {
            throw new Error(
              `${this.identifier} requires '${requiredDataKey}' data`,
            )
          }
        })
      }

      checkRequiredElements () {
        this._requiredElements.forEach(requiredElementKey => {
          if (!this.hasEl(requiredElementKey)) {
            throw new Error(
              `${this.identifier} requires a child element called '${requiredElementKey}'. data-${this.identifier}-el="${requiredElementKey}" is missing`,
            )
          }
        })
      }

      initialize () {
        const second = 1000
        const minute = second * 60
        const hour = minute * 60
        const day = hour * 24

        const countDown = new Date(this.dataset.endDate).getTime()

        this.now = new Date().getTime()
        this.distance = countDown - this.now

        this.setAttribute('aria-hidden', 'false')

        if (this.distance < 1) return

        this.countdownInterval = setInterval(() => {
          this.now = new Date().getTime()
          this.distance = countDown - this.now

          const time = {
            days: Math.floor(this.distance / day),
            hours: Math.floor((this.distance % day) / hour),
            minutes: Math.floor((this.distance % hour) / minute),
            seconds: Math.floor((this.distance % minute) / second),
          }

          this.getEl('days').innerText = time.days.toString().padStart(2, '0')
          this.getEl('hours').innerText = time.hours.toString().padStart(2, '0')
          this.getEl('minutes').innerText = time.minutes
            .toString()
            .padStart(2, '0')
          this.getEl('seconds').innerText = time.seconds
            .toString()
            .padStart(2, '0')

          const dayTextEl = this.getTextEl('dayText')
          const hourTextEl = this.getTextEl('hourText')
          const minuteTextEl = this.getTextEl('minuteText')
          const secondTextEl = this.getTextEl('secondText')

          dayTextEl.innerText = pluralize(
            dayTextEl.dataset.initialValue,
            time.days,
          )
          hourTextEl.innerText = pluralize(
            hourTextEl.dataset.initialValue,
            time.hours,
          )
          minuteTextEl.innerText = pluralize(
            minuteTextEl.dataset.initialValue,
            time.minutes,
          )
          secondTextEl.innerText = pluralize(
            secondTextEl.dataset.initialValue,
            time.seconds,
          )

          this.getEl('daysblock').setAttribute('aria-hidden', time.days === 0)
          this.getEl('hoursblock').setAttribute('aria-hidden', false)
          this.getEl('minutesblock').setAttribute('aria-hidden', false)
          this.getEl('secondsblock').setAttribute('aria-hidden', time.days > 0)

          this.timeIsUp = false
        }, second)
      }

      hasData (key) {
        return !!this.dataset[key]
      }

      hasEl (key) {
        return !!(this.els[key] && this.els[key].element)
      }

      getEl (key) {
        return this.els[key].element
      }

      getTextEl (key) {
        const el = this.getEl(key)
        el.dataset.initialValue = el.dataset.initialValue
          ? el.dataset.initialValue
          : el.innerText
        return el
      }

      set distance (distance) {
        this._distance = distance

        if (this.hasEl('title')) {
          this.els.title.element.setAttribute(
            'aria-hidden',
            (distance < 1).toString(),
          )
        }

        if (this.hasEl('body')) {
          this.els.body.element.setAttribute(
            'aria-hidden',
            (distance < 1).toString(),
          )
        }

        if (this.hasEl('expiredText')) {
          this.els.expiredText.element.setAttribute(
            'aria-hidden',
            (!(distance < 1)).toString(),
          )
        }

        if (distance < 1 && this.countdownInterval) {
          clearInterval(this.countdownInterval)
        }
      }

      get distance () {
        return this._distance
      }
    },
  )
}
