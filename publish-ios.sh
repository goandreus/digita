# #!/bin/sh
# ENVIRONMENT=$1
# if [ $# -lt 2 ]; then
#     echo "Error: Debes proporcionar la versión como el segundo argumento."
#     exit 1
# fi

# NEW_BUNDLE_VERSION=$2

# d=$(date +%Y%m%d_%H%M)
# VAR_IPA_NAME=$ENVIRONMENT'_'$d
# VAR_ARCHIVE_NAME=$ENVIRONMENT'_'$d

# INFO_PLIST_PATH="ios/CompartamosFinanciera/Info("$ENVIRONMENT").plist"
# /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $NEW_BUNDLE_VERSION" $INFO_PLIST_PATH

# xcodebuild CODE_SIGN_IDENTITY="Apple Development" \
#     -destination generic/platform=iOS \
#     -workspace ios/CompartamosFinanciera.xcworkspace \
#     -scheme 'CompartamosFinanciera('$ENVIRONMENT')' \
#     clean archive -configuration release \
#     -archivePath ./temp_ios/$VAR_ARCHIVE_NAME.xcarchive


# xcodebuild \
#     -exportArchive \
#     -archivePath ./temp_ios/$VAR_ARCHIVE_NAME.xcarchive \
#     -exportOptionsPlist ios/exportOptions.plist \
#     -exportPath ./temp_ios/$VAR_IPA_NAME.ipa

# echo '**IPA GENERATED** in temp_ios/'$VAR_IPA_NAME'.ipa'

# osascript -e 'display alert "IPA generated" message "temp_ios/'$VAR_IPA_NAME'.ipa"'
# open ./temp_ios