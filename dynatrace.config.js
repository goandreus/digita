module.exports = {
  react: {
    debug: true,
    autoStart: true,
    lifecycle: {
      /**
       * Decide if you want to see Update Cycles as well
       */
      includeUpdate: false,

      /**
       * Filter for Instrumenting Lifecycle of Components / True = Will be instrumented
       */
      instrument: filename => {
        return false;
      },
    },

    input: {
      /**
       * Allows you to filter the instrumentation for touch events, refresh events and picker events in certain files
       * True = Will be instrumented
       */
      instrument: filename => {
        return true;
      },
    },
    actionNamePrivacy: false,
  },
  android: {
    config: `
        dynatrace {
            configurations {
              dev {
                  variantFilter "dev"
                  autoStart {
                    applicationId '04920f58-6444-42ef-a286-494d0f5ade94'
                    beaconUrl 'https://bf48910glg.bf.dynatrace.com/mbeacon'
                  }
                  userOptIn false
                  debug.agentLogging true
                  agentBehavior.startupLoadBalancing true
              }
              qas {
                  variantFilter "qas"
                  autoStart {
                    applicationId '6cfa4926-82a7-488d-aeaf-a5560f0a99b3'
                    beaconUrl 'https://bf48910glg.bf.dynatrace.com/mbeacon'
                  }
                  userOptIn false
                  debug.agentLogging true
                  agentBehavior.startupLoadBalancing true
              }
              qa {
                  variantFilter "qa"
                  autoStart {
                    applicationId '6cfa4926-82a7-488d-aeaf-a5560f0a99b3'
                    beaconUrl 'https://bf48910glg.bf.dynatrace.com/mbeacon'
                  }
                  userOptIn false
                  debug.agentLogging true
                  agentBehavior.startupLoadBalancing true
              }
              prod {
                  variantFilter "prod"
                  autoStart {
                    applicationId 'af2629b2-9162-42a5-b74f-b2c938c3c82d'
                    beaconUrl 'https://bf48910glg.bf.dynatrace.com/mbeacon'
                  }
                  userOptIn false
                  debug.agentLogging true
                  agentBehavior.startupLoadBalancing true
              }
            }
        }
        `,
  },
  ios: {
    config: `
        <key>DTXApplicationID</key>
        <string>$(APPLICATIONID)</string>
        <key>DTXBeaconURL</key>
        <string>$(DYNATRACE_BEACON_URL)</string>
        <key>DTXLogLevel</key>
        <string>ALL</string>
        <key>DTXUserOptIn</key>
        <false/>
        <key>DTXStartupLoadBalancing</key>
        <true/>
        `,
  },
};
