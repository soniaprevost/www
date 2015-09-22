class StoriesItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: this.props.active
    }
  }

  render() {
    var componentClasses = classNames({
      'story-item': true,
      'is-active': (this.props.index + 1) == this.props.activeItem
    })

    return(
        <div className={componentClasses} onMouseEnter={this.handleClick.bind(this)} onClick={this.handleClick.bind(this)}>
          <div className='story-item-name'>
            {this.props.alumni.first_name} {this.props.alumni.last_name}
            <span className='pull-right story-item-batch'>Batch #{this.props.alumni.slug}, {this.props.alumni.city}</span>
          </div>
          <div className='story-item-description'>
            {this.props.description.fr}
          </div>
        </div>
    )
  }

  handleClick() {
    this.setState({ active: true })
    PubSub.publish('updateActiveItem', this.props.index + 1)
  }
}
