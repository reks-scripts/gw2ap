'use strict'

import { filterCategory } from './filter-category'
import { filterComplete } from './filter-complete'
import { filterGroup } from './filter-group'
import { filterInProgress } from './filter-in-progress'
import { filterItem } from './filter-reward-item'
import { filterMastery } from './filter-reward-mastery'
import { filterNotStarted } from './filter-not-started'
import { filterTitle } from './filter-reward-title'

const Filters = {
  filterCategory,
  filterComplete,
  filterGroup,
  filterInProgress,
  filterItem,
  filterMastery,
  filterNotStarted,
  filterTitle
}

export { Filters }