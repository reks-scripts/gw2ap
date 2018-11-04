'use strict'

import { filterCategory } from './filter-category'
import { filterComplete } from './filter-complete'
import { filterGroup } from './filter-group'
import { filterInProgress } from './filter-in-progress'
import { filterMinNextTier } from './filter-min-next-tier'
import { filterMinRemaining } from './filter-min-remaining'
import { filterNotStarted } from './filter-not-started'
import { filterObjectiveCount } from './filter-objective-count'
import { filterItem } from './filter-reward-item'
import { filterMastery } from './filter-reward-mastery'
import { filterTitle } from './filter-reward-title'

const Filters = {
  filterCategory,
  filterComplete,
  filterGroup,
  filterInProgress,
  filterMinNextTier,
  filterMinRemaining,
  filterNotStarted,
  filterObjectiveCount,
  filterItem,
  filterMastery,
  filterTitle
}

export { Filters }