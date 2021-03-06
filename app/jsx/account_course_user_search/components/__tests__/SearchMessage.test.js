/*
 * Copyright (C) 2018 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react'
import {mount} from 'enzyme'
import SearchMessage from '../SearchMessage'

const getProps = () => ({
  collection: {
    data: [1, 2, 3],
    links: {
      current: {
        url: 'abc',
        page: '5'
      },
      last: {
        url: 'abc10',
        page: '10'
      }
    }
  },
  setPage: jest.fn(),
  noneFoundMessage: 'None Found!',
  dataType: 'Course'
})

let flashElements
beforeEach(() => {
  flashElements = document.createElement('div')
  flashElements.setAttribute('id', 'flash_screenreader_holder')
  flashElements.setAttribute('role', 'alert')
  document.body.appendChild(flashElements)
})

afterEach(() => {
  document.body.removeChild(flashElements)
})

it('shows spinner when loading', () => {
  const props = getProps()
  props.collection.loading = true
  const wrapper = mount(<SearchMessage {...props} />)
  expect(wrapper.find('Spinner').exists()).toBe(true)
})

describe('Pagination Handling', () => {
  it('can handle lots of pages', () => {
    const props = getProps()
    props.collection.links.last.page = '1000'
    const wrapper = mount(<SearchMessage {...props} />)

    const buttons2 = wrapper.find('PaginationButton').map(x => x.text())
    expect(buttons2).toEqual(['1', '4', '5', '6', '7', '8', '1,000'])

    wrapper.find('button[aria-label="Page 1,000"]').simulate('click')
    wrapper.setProps({}) // Make sure it triggers componentWillReceiveProps

    const buttons = wrapper.find('PaginationButton').map(x => x.text())
    expect(buttons).toEqual(['1', '4', '5', '6', '7', '8', '1,000'])
  })

  it('sets state to lastUnknown if there is no last link', () => {
    const props = getProps()
    const wrapper = mount(<SearchMessage {...props} />)
    delete props.collection.links.last
    props.collection.links.next = {url: 'next', page: '2'}
    wrapper.setProps(props)
    expect(wrapper.instance().isLastPageUnknown()).toBe(true)
  })

  it('sets state to lastUnknown false if there is a last link', () => {
    const props = getProps()
    const wrapper = mount(<SearchMessage {...props} />)
    delete props.collection.links.last
    props.collection.links.next = {url: 'next', page: '2'}
    wrapper.setProps(props)
    wrapper.setProps(getProps())
    expect(wrapper.instance().isLastPageUnknown()).toBe(false)
  })
})
