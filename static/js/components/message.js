Vue.component("message", {
<<<<<<< HEAD
  props: [
    type: String,
    text: String
  ],
=======
  props: {
    type: String,
    text: String
  },
>>>>>>> aebccb2bdfa468a60b91c646b217eb06247aca45
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
