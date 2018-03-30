<template>
  <div>
    <h2 class="ui header">
      <i class="mail outline icon"></i>
      <div class="content">Contact Us With Your
        <div class="sub header">Questions • Concerns • Suggestions • Submissions • Issue </div>
      </div>
    </h2>
    <div class="ui divider"></div>
    <div class="ui form">
      <div class="three fields">
        <div id="name" class="field">
          <label>Name</label><input type="text" placeholder="Name">
        </div>
        <div id="email" class="field">
          <label>Email</label><input type="text" placeholder="Email">
        </div>
        <div class="field">
          <label>Phone</label><input type="text" placeholder="Phone">
        </div>
      </div>
      <div class="fields">
        <div id="subject" class="twelve wide field">
          <label>Subject</label><input type="text" placeholder="Subject">
        </div>
        <div class="four wide field">
          <label>Services</label>
          <select id='service' class="ui fluid dropdown">
            <option value="general">General Inquiry</option>
            <option value="technical">Technical Support</option>
            <option value="music">Music Submission</option>
            <option value="business">Business Partnership</option>
            <option value="advertising">Advertising & Promotion</option>
          </select>
        </div>
      </div>
      <div id="message" class="field">
        <label>Message</label><textarea></textarea>
      </div>
      <br>
      <button id='submit' class="ui inverted red button" type="submit">Submit</button>
      <div id='success' class="ui ignored positive message hidden">Email Sent</div>
      <div id='fail' class="ui ignored positive message hidden">Failed. Try Again</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
