class Stories extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeItem: 1,
      transition: false,
      exitingItem: null
    }
  }


  render() {
    var detailClasses = classNames({
      'story-detail': true,
      'is-active': this.state.transition
    })

    return (
      <div className='story-overlay'>
        <div className='container story-label-container'>
          <div className='story-label'>
            <i className="mdi mdi-heart"></i>
          </div>
          <span>{this.props.i18n.title}</span>
        </div>
        {this.props.stories.map((story, index) => {
          var backgroundStyle = {
            backgroundSize: "cover !important",
            backgroundImage: "url('" + story.picture + "')"
          }

          var detailClasses = classNames({
            'story-detail hidden-sm hidden-xs': true,
            'is-active':  index + 1 == this.state.activeItem,
            'is-exiting': index + 1 == this.state.exitingItem
          })

          return(
            <div className={detailClasses} key={index}>
              <div className='story-detail-background' style={backgroundStyle}>
              </div>
            </div>
          )
        })}
          <div className='container'>
           <div className='story'>
            <div className='story-list'>
              {this.props.stories.map((story, index) => {
                return <StoriesItem {... story}
                  index={index}
                  key={index}
                  i18n={this.props.i18n}
                  activeItem={this.state.activeItem}
                  locale={this.props.locale}/>
              })}
            </div>
          </div>
        </div>
        <a href={Routes.story_path({github_nickname: this.props.stories[0].alumni.github_nickname})} className="btn btn-danger stories-link hidden-xs hidden-sm">{this.props.i18n.read_all}</a>
      </div>
    )
  }

  componentDidMount() {
    PubSub.subscribe('updateActiveItem', (msg, index) => {
      this.setState({
        activeItem: index.new,
        exitingItem: index.old
      })
    })
  }
}
