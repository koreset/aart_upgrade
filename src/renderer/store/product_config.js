import { defineStore } from 'pinia'

export const useProductStore = defineStore({
  id: 'product',
  state: () => ({
    product: {
      product_name: '',
      product_code: '',
      product_family_id: 0,
      product_transition_states: [],
      product_transitions: [],
      product_rating_factors: [],
      global_tables: [],
      product_tables: [],
      product_pricing_tables: [],
      product_modelpoint_variables: []
    },
    product_features: []
  }),
  getters: {
    getProduct: (state) => state.product,
    getProductName: (state) => state.product.product_name,
    getProductCode: (state) => state.product.product_code,
    getProductFamilyId: (state) => state.product.product_family_id,
    getProductTransitionStates: (state) => state.product.product_transition_states,
    getProductTransitions: (state) => state.product.product_transitions,
    getProductGlobalTables: (state) => state.product.global_tables,
    getProductRatingFactors: (state) => state.product.product_rating_factors,
    getSelectedFeatures: (state) => state.product_features
  },
  actions: {
    resetProductState() {
      this.product = {
        product_name: '',
        product_code: '',
        product_family_id: 0,
        product_transition_states: [],
        product_transitions: [],
        product_rating_factors: [],
        global_tables: [],
        product_tables: [],
        product_pricing_tables: [],
        product_modelpoint_variables: [],
        product_features: []
      }
    },
    setProductState(payload) {
      this.product.product_name = payload.product_name
      this.product.product_code = payload.product_code
      this.product.product_family_id = payload.product_family_id
      this.product.product_transition_states = payload.product_transition_states
      this.product.product_transitions = payload.product_transitions
    },
    setProductName(name) {
      this.product.product_name = name
    },
    setProductCode(code) {
      this.product.product_code = code
    },
    setProductFamilyId(familyId) {
      this.product.product_family_id = familyId
    },
    setProductTransitionStates(states) {
      this.product.product_transition_states = states
    },
    addToTransitions(transitions) {
      this.product.product_transitions.push(transitions)
    },
    removeFromTransitions(item) {
      this.product.product_transitions = this.product.product_transitions.filter(
        (transition) => transition !== item
      )
    },
    setProductFeatures(features) {
      this.product_features = features
    },
    addToProductRatingFactors(ratingFactor) {
      this.product.product_rating_factors.push(ratingFactor)
    },
    addToProductTables(table) {
      this.product.product_tables.push(table)
      this.product.product_pricing_tables.push(table)
    },
    setProductModelPoints(points) {
      this.product.product_modelpoint_variables = points
    }
  }
})
