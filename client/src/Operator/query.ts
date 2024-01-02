import { gql } from '@apollo/client'

export const QUERY_OPERATOR_CONNECTION_LIST = gql`
  query OperatorsConnection($first: Int!, $after: String, $orderBy: [OperatorOrderByInput!]!) {
    operatorsConnection(orderBy: $orderBy, first: $first, after: $after) {
      edges {
        node {
          id
          operatorOwner
          currentDomainId
          currentEpochRewards
          currentTotalStake
          minimumNominatorStake
          nextDomainId
          nominationTax
          signingKey
          status
          totalShares
          updatedAt
          nominators(limit: 300) {
            id
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`

export const QUERY_OPERATOR_BY_ID = gql`
  query OperatorById($operatorId: String!) {
    operatorById(id: $operatorId) {
      id
      operatorOwner
      currentDomainId
      currentEpochRewards
      currentTotalStake
      minimumNominatorStake
      nextDomainId
      nominationTax
      signingKey
      status
      totalShares
      updatedAt
      nominators(limit: 300) {
        id
        shares
        account {
          id
        }
      }
    }
  }
`
