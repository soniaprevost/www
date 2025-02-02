class ApplyForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeCity: this.props.city,
      activeBatch: this.firstBatch(this.props.city),
      submitting: false
    }
  }

  render() {

    var batches = this.state.activeCity.batches;

    var componentClasses = classNames({
      'apply-form': true
    })

    var submitButton = null;
    if (this.state.submitting) {
      submitButton = (
        <input id='apply_btn' type='submit' value={this.props.i18n.please_wait} disabled className='apply-form-submit btn' />
        );
    } else {
      submitButton = (
        <input id='apply_btn' type='submit' value={this.props.i18n.apply_btn + this.state.activeCity.name} className='apply-form-submit btn' />
        );
    }

    var courseLanguage =
      this.props.i18n.course_language +
      this.props.i18n['language_' + this.state.activeCity.course_locale];

    return(
      <div className={componentClasses}>
        <div className="banner-container">
          <div className="container banner-city-container">
            <div className='banner-city-nav'>
              {this.props.cities.map((city, index) => {
                return (
                  <CityNavItem
                    key={index}
                    city={city}
                    setActiveCity={(city) => this.setActiveCity(city)}
                    isActive={this.state.activeCity.slug == city.slug}
                  />
                )
              })}
            </div>
            <div className='apply-form-body'>
              <div className='banner-city-wrapper'>

                {this.props.cities.map((city, index) => {

                  var bannerClasses = classNames({
                    'banner-city banner banner-top banner-gradient text-center': true,
                    'is-active': this.state.activeCity.slug == city.slug
                  })

                  var bannerCityStyle = {
                    backgroundImage: "url(" + city.pictures.city.cover  + ")"
                  };

                  return(
                    <div key={index} className={bannerClasses} style={bannerCityStyle}>
                      <div className="banner-gradient-shadow"></div>
                      <div className="banner-content">
                        <h1 className='glitch'>
                          {this.props.i18n.title} <span className='city'>{city.name}</span>
                        </h1>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className='apply-form-rows-container'>
                <form id="apply" action={Routes.apply_path()} method='post' onSubmit={this.onSubmit.bind(this)}>
                  <div dangerouslySetInnerHTML={{__html: Csrf.getInput(this.props.token)}}></div>
                  <div className="apply-form-row apply-form-row-first" >
                    <label>
                      <i className='mdi mdi-calendar-multiple-check'></i>Dates
                    </label>
                    <div className="apply-form-row-item">
                      <div className='post-submissions-select'>
                        <ReactBootstrap.DropdownButton ref='selectType' title={this.state.activeBatch.starts_at + ' - ' + this.state.activeBatch.ends_at}>
                          {batches.map((batch, index) => {
                            return(
                              <BatchSelector
                                key={index}
                                batch={batch}
                                isActive={batch.id == this.state.activeBatch.id}
                              />
                            )
                          })
                          }
                        </ReactBootstrap.DropdownButton>
                        <input type='hidden' name='application[batch_id]' value={this.state.activeBatch.id} />
                        <input type='hidden' name='application[city_id]' value={this.state.activeCity.id} />
                      </div>
                    </div>
                  </div>
                  {this.props.rows.map( (row, index) => {
                    return <ApplyFormRow key={index} {... row} />
                  })}
                  <div className='apply-form-row-submit'>
                    <div className='apply-form-price'>
                      <div>
                        {courseLanguage}.
                      </div>
                      {this.props.i18n.price}: {this.state.activeBatch.price} {this.props.i18n.conditions}
                    </div>
                    {submitButton}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    PubSub.subscribe('setActiveBatch', (msg, data) => {
      this.setState({
        activeBatch: data
      })
    })
  }

  setActiveCity(city) {
    if (this.state.activeCity !== city) {
      this.setState({ activeCity: city, activeBatch: this.firstBatch(city) })
      history.replaceState({}, '', this.props.apply_path.replace(':city', city.slug));
    }
  }

  firstBatch(city) {
    return _.filter(city.batches, (n) => { return !n.full })[0] // to take the first not full batch.
  }

  onSubmit() {
    this.setState({ submitting: true });
  }
}
