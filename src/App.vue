<template>

  <HelloClient />

  <TheFooter />
</template>

<script>
import HelloClient from './components/MainFunctionalities/HelloClient.vue'
import TheFooter from './components/MainFunctionalities/TheFooter.vue'

export default {
  name: 'App',
  components: {
    HelloClient,
    TheFooter
  }
}
</script>

<style>
body {
  margin: 0;
  background: var(--surface-ground);
  background-repeat: no-repeat;
  background-position: bottom center;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1440' height='250' preserveAspectRatio='none' viewBox='0 0 1440 250'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1009%26quot%3b)' fill='none'%3e%3crect width='1440' height='250' x='0' y='0' fill='rgba(239%2c 243%2c 248%2c 1)'%3e%3c/rect%3e%3cpath d='M3 250L253 0L292 0L42 250z' fill='url(%23SvgjsLinearGradient1010)'%3e%3c/path%3e%3cpath d='M259.6 250L509.6 0L637.1 0L387.1 250z' fill='url(%23SvgjsLinearGradient1010)'%3e%3c/path%3e%3cpath d='M495.20000000000005 250L745.2 0L890.7 0L640.7 250z' fill='url(%23SvgjsLinearGradient1010)'%3e%3c/path%3e%3cpath d='M739.8000000000001 250L989.8000000000001 0L1033.3000000000002 0L783.3000000000001 250z' fill='url(%23SvgjsLinearGradient1010)'%3e%3c/path%3e%3cpath d='M1409 250L1159 0L1067.5 0L1317.5 250z' fill='url(%23SvgjsLinearGradient1011)'%3e%3c/path%3e%3cpath d='M1174.4 250L924.4000000000001 0L876.4000000000001 0L1126.4 250z' fill='url(%23SvgjsLinearGradient1011)'%3e%3c/path%3e%3cpath d='M953.8 250L703.8 0L525.3 0L775.3 250z' fill='url(%23SvgjsLinearGradient1011)'%3e%3c/path%3e%3cpath d='M719.1999999999999 250L469.19999999999993 0L365.69999999999993 0L615.6999999999999 250z' fill='url(%23SvgjsLinearGradient1011)'%3e%3c/path%3e%3cpath d='M1196.0209792410485 250L1440 6.020979241048508L1440 250z' fill='url(%23SvgjsLinearGradient1010)'%3e%3c/path%3e%3cpath d='M0 250L243.9790207589515 250L 0 6.020979241048508z' fill='url(%23SvgjsLinearGradient1011)'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1009'%3e%3crect width='1440' height='250' fill='white'%3e%3c/rect%3e%3c/mask%3e%3clinearGradient x1='0%25' y1='100%25' x2='100%25' y2='0%25' id='SvgjsLinearGradient1010'%3e%3cstop stop-color='rgba(217%2c 225%2c 235%2c 1)' offset='0'%3e%3c/stop%3e%3cstop stop-opacity='0' stop-color='rgba(217%2c 225%2c 235%2c 1)' offset='0.66'%3e%3c/stop%3e%3c/linearGradient%3e%3clinearGradient x1='100%25' y1='100%25' x2='0%25' y2='0%25' id='SvgjsLinearGradient1011'%3e%3cstop stop-color='rgba(217%2c 225%2c 235%2c 1)' offset='0'%3e%3c/stop%3e%3cstop stop-opacity='0' stop-color='rgba(217%2c 225%2c 235%2c 1)' offset='0.66'%3e%3c/stop%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e");
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#app .p-component {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
#app .p-button-primary, .p-button.p-button-primary{
  background: #23013a!important;
  border: 1px solid #23013a!important;
}
#app .p-button-primary:enabled:active,
#app .p-button.p-button-primary:enabled:hover,
.p-button.p-button-primary:enabled:active,
.p-button.p-button-primary:enabled:hover
{
    background: #01e89f!important;
    border-color: #01e89f!important;
    color:#23013a!important;
}
.p-datepicker table td > span.p-highlight {
    color: var(--primary-600)!important;
    background: var(--primary-50)!important;
}
.p-datepicker table td > span:focus {
    box-shadow: 0 0 0 0.2rem var(--primary-100)!important;
}
.p-inputtext:enabled:hover{
    border-color: var(--primary-400)!important;
}
.p-inputtext:enabled:focus {
    box-shadow: 0 0 0 0.2rem var(--primary-100)!important;
    border-color: var(--primary-300)!important;
}
.p-button:focus {
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--primary-200), 0 1px 2px 0 black!important;
}
.p-selectbutton .p-button.p-highlight {
    color: var(--primary-color);
}
:root {
  --primary-color: #1bd097!important;
  --primary-50: #eefcf8!important;
  --primary-100: #dbf9f0!important;
  --primary-200: #9fe7d1!important;
  --primary-300: #8ee8cb!important;
  --primary-400: #33e8ae!important;
  --primary-500: #01e89f!important;
  --primary-600: #1bd097!important;
  --primary-700: #0b9166!important;
  --primary-800: #196e53!important;
  --primary-900: #1a624b!important;
  --focus-ring: 0 0 0 0.2rem var(--primary-100)!important;
}
@keyframes p-progress-spinner-color {
  100%,
  0% {
    stroke: var(--primary-color);
  }
  40% {
    stroke: var(--surface-ground);
  }
  66% {
    stroke: var(--primary-color);
  }
  80%,
  90% {
    stroke: var(--surface-ground);
  }
}
.pulse {
  width: 16px;
  border-radius: 25px;
  position: relative;
  height: 16px;
  box-shadow: 0 0 0 2px var(--primary-500), inset 0 0 0 3px white;
  padding: 4px;
  background: var(--primary-500);
}
.pulse:before {
  content: "";
  border-radius: 25px;
  background: var(--primary-500);
  width: 17px;
  height: 16px;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  animation: pulse-animate 2s infinite;
  margin: -8px 0 0 -8px;
}
.pulse:after {
  content: "";
  border-radius: 25px;
  background: var(--primary-500);
  width: 16px;
  height: 16px;
  opacity: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  animation: pulse-animate 3s infinite;
  margin: -8px;
}
.large-sidebar .p-sidebar-header {
  justify-content: space-between !important;
}
.large-sidebar.blurred {
  transform: scale(0.95) translate(-40px, 20px) !important;
}
@keyframes pulse-animate {
  0% {
    opacity: 1;
    transform: scale(0);
  }
  100% {
    opacity: 0;
    transform: scale(3);
  }
}
.p-tabview .p-tabview-nav li .p-tabview-nav-link {
  font-size: 13px;
  min-width: max-content!important;
}
</style>
