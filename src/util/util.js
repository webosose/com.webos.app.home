export const getDisplayAffinity = () =>{
    if (typeof window !== 'undefined') {
        return JSON.parse(window.PalmSystem.launchParams).displayAffinity;
    }
    return 0;
}

export const getClientWidth = () =>{
    if (typeof window !== 'undefined') {
        return  window.innerWidth;
    }
}
