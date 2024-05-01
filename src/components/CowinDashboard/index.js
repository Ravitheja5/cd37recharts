import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const initialValues = {
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    sevenDaysData: [],
    dataByGender: [],
    dataByAge: [],
    apiStatus: initialValues.progress,
  }

  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')

    if (response.ok === true) {
      const data = await response.json()

      const dataByGenderList = data.vaccination_by_gender

      const dataByAgeList = data.vaccination_by_age

      const sevenDayaDataList = data.last_7_days_vaccination
      const updatedSevenDaysData = sevenDayaDataList.map(eachObject => ({
        dose1: eachObject.dose_1,
        dose2: eachObject.dose_2,
        vaccineDate: eachObject.vaccine_date,
      }))

      console.log(updatedSevenDaysData)
      console.log(dataByGenderList)

      this.setState({
        sevenDaysData: updatedSevenDaysData,
        dataByGender: dataByGenderList,
        dataByAge: dataByAgeList,
        apiStatus: initialValues.success,
      })
    } else {
      this.setState({apiStatus:initialValues.failure})
    }
  }

  renderBasedOnTheApiStatus = () => {
    const {apiStatus} = this.state

    console.log(apiStatus)

    switch (apiStatus) {
      case initialValues.success:
        return this.renderSuccessView()
        break
      case initialValues.failure:
        return this.renderFailureView()
        break
      case initialValues.progress:
        return this.renderProgressView()
    }
  }

  renderSuccessView = () => {
    const {sevenDaysData, dataByGender, dataByAge, isLoading, showError} =
      this.state

    return (
      <div className="dashboard-container">
        <div className="box">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="plus-icon"
          />
          <p className="para">Co-Win</p>
        </div>
        <h1 className="heading">CoWIN Vaccination in India</h1>
        <div className="container">
          <VaccinationCoverage data={sevenDaysData} />
        </div>
        <div className="container">
          <VaccinationByGender data={dataByGender} />
        </div>
        <div className="container">
          <VaccinationByAge data={dataByAge} />
        </div>
      </div>
    )
  }

  renderProgressView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => {
    return (
      <div className="error-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
          alt="failure view"
          className="error-image"
        />
        <h1>Something went wrong</h1>
      </div>
    )
  }

  render() {
    
     return this.renderBasedOnTheApiStatus()
    
  }
}

export default CowinDashboard
