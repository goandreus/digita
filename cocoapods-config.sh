# #! /bin/zsh

# install_cocoapods () {
#     echo "Installing cocoapods with gem"
#     # Creating new gems home if it doesnt't exist
#     if [ ! -d "$HOME/.gem" ]; then
#         mkdir "$HOME/.gem"
#     fi

#     # Adding to current session
#     export GEM_HOME="$HOME/.gem"
#     export PATH="$GEM_HOME/bin:$PATH"

#     # Adding for future sessions
#     if test -f "$HOME/.zshrc"; then
#         echo 'Adding $GEM_HOME env var and then adding it to your $PATH'
#         echo '' >> "$HOME/.zshrc"
#         echo 'export GEM_HOME="$HOME/.gem"' >> "$HOME/.zshrc"
#         echo 'export PATH="$GEM_HOME/bin:$PATH"' >> "$HOME/.zshrc"
#         echo 'alias pod='arch -x86_64 pod'' >> "$HOME/.zshrc"
#     fi

#     # Installing cocoapods
#     gem install cocoapods
#     sudo arch -x86_64 gem install ffi
#     which pod
#     pod --version
#     gem install cocoapods-art
    

# }

# uninstall_cocoapods_homebrew () {
#     which -s brew
#     if [[ $? != 0 ]] ; then
#         echo "Homebrew not installed, skipping uninstalling cocoapods from 
# homebrew"
#     else
#         brew uninstall cocoapods
#     fi
# }

# if ! type "pod" > /dev/null; then
#     echo "You don't have cocoapods installed..."    
# else
#     echo "Trying to uninstall it from homebrew first"
#     uninstall_cocoapods_homebrew    
# fi

# install_cocoapods