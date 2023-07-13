
//definition of the two themes of the app
const LIGHT_THEME = {
    backgroundColor : '#F0F0F0',
    buttonColor : '#0D67B5',
    buttonLightColor : '#2196F3',
    textColor : '#000000',
    modalColor : '#EEEEEE',
    buttonLightColor : '#33A7C3',
    shadowColor : '#404040',
    userCard : '#FFFFFF',
    placeholderColor : '#777777'
};
global.darkTheme = {
    backgroundColor : '#000000',
    buttonColor : '#0D67B5',
    buttonLightColor : '#007490',
    textColor : '#DDDDDD',
    modalColor : '#222222',
    buttonLightColor : '#006380',
    shadowColor : '#606060',
    userCard : '#202020',
    placeholderColor : '#999999'
};
global.lightTheme = LIGHT_THEME;


//variable storing the current theme colors
global.theme = LIGHT_THEME;

//varibale to test whether or not darkMode is active
global.darkMode = false;
