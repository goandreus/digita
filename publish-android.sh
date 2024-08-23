# #!/bin/sh
# ENVIRONMENT=$1
# if [ $# -lt 2 ]; then
#     echo "Error: Debes proporcionar la versión como el segundo argumento."
#     exit 1
# fi

# NEW_BUNDLE_VERSION=$2

# d=$(date +%Y%m%d_%H%M)
# VAR_APK_NAME=$ENVIRONMENT'_'$d
# VAR_APK_OFUSCATED_NAME=$ENVIRONMENT'_'$d'_OFUSCATED'


# mkdir -p node_modules/react-native-mmkv/android/build/downloads
# cp -r temp_mmkv/. node_modules/react-native-mmkv/android/build/downloads

# npx instrumentDynatrace \
#  gradle='./android/build.gradle' \
#  plist='./ios/CompartamosFinanciera/Info('$ENVIRONMENT').plist' \
#  config='./dynatrace.config.js'

# cd android
# case $ENVIRONMENT in
# qa)
#     ./gradlew app:assembleQaRelease
#     ;;
# qas)
#     ./gradlew app:assembleQasRelease
#     ;;
# prod)
#     ./gradlew app:assembleProdRelease
#     ;;
# dev)
#     ./gradlew app:assembleDevRelease
#     ;;
# esac
# cd ..
# mkdir -p temp_android
# cp android/app/build/outputs/apk/$ENVIRONMENT/release/app-$ENVIRONMENT-release.apk temp_android/$VAR_APK_NAME.apk
# cp android/app/build/outputs/apk/$ENVIRONMENT/release/app-$ENVIRONMENT-release-protected.apk temp_android/$VAR_APK_OFUSCATED_NAME.apk

# echo '**APK GENERATED** in temp_android/'$VAR_APK_NAME'.apk'

# osascript -e 'display alert "APK generated" message "temp_android/'$VAR_APK_NAME'.apk"'
# open ./temp_android
