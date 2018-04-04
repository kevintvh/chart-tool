import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { app_settings } from '../../modules/settings';
import { slugParse, debounce } from '../../modules/utils';

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.setSlugValue = debounce(this.setSlugValue, 500);
    this.state = {
      slug: this.props.chart && this.props.chart.slug ? this.props.chart.slug : ''
    };
  }

  setSlugValue(slug) {
    Meteor.call('charts.update.slug', this.props.match.params._id, slug, err => {
      if (err) console.log(err);
    });
  }

  updateSlug(event) {
    const slugData = event.target.value,
      slug = slugParse(slugData);
    if (slug) {
      this.setState({ slug });
      this.setSlugValue(slug);
    }
  }

  renderEditSlug() {
    return (
      <div className='header-grid'>
        <div className='chart-slug'>
          <input
            type='text'
            name='slug'
            className='input-slug-edit'
            placeholder={this.state.slug}
            value={this.state.slug}
            onChange={this.updateSlug.bind(this)}
          />
        </div>
        { this.renderNav() }
      </div>
    );
  }

  renderNav() {
    return (
      <div className={this.props.edit ? 'header-edit-nav' : 'header-nav'}>
        <h2 className='header-help'><Link to={ app_settings.help || 'http://www.github.com/globeandmail/chart-tool' }>Help</Link></h2>
        <h2 className='header-list'><Link to='/archive'>Archive</Link></h2>
        <h2 className='header-new'><Link to='/new'>New chart</Link></h2>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.chart !== nextProps.chart) {
      const slug = nextProps.chart.slug;
      this.setState({ slug });
    }
  }

  render() {
    return (
      <header className={this.props.edit ? 'header-edit' : ''}>
        <div className='topbar'></div>
        <div className='header-baseline'>
          {this.props.edit ? this.renderEditSlug() : this.renderNav()}
        </div>
      </header>
    );
  }
}