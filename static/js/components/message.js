Vue.component("message", {
  props: {
    type: String,
    text: String
  },
  methods: {
    alertType: function() {
      return {
        'alert-success': this.type === 'success',
        'alert-warning': this.type === 'warning',
        'alert-danger': this.type == 'error',
        'alert-info': this.type === 'info'
      }
    }
  },
  template: `
    <div class="alert flash" v-bind:class="alertType()">
      {{ text }}
    </div>
  `
})
