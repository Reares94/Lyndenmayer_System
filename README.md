# Lyndenmayer_System
3D plants generation
-----------------------------------------------------------------------------------------------

This project renders three-dimensional L-systems using Javascript with Three.js framework which is based on WebGL.
In the scene, specifically on the pitch, you can plant different types of trees that are modeled according to the L-system theory.

------------------------------------------------------------------------------------------------

How can I produce the results? 

1 You have to click with the mouse on the ground 

2 If you click on the plant button immediately, a simple prototype tree will be planted

3 You can also choose to plant preset trees after opening the sample button menu and selecting your favorite plant 

4 After opening the shape menu you can modify or create, according to the rules shown below in black, the plant with respect to the selection preset 

--------------------------------------------------------------------------------------------------

How do I install it?

Download the code and launch the index.html file with a browser. The code has been tested with Mozilla Firefox and Google Chrome.
You should have a dedicated GPU to render more trees and to use a higher number of iterations(the maximum allowed is 7).

A)Google Chrome:

You must enable Google Chrome through "allow-file-access-from-files" to load textures.In the macOS you can write the following line of code to enable Chrome from the command prompt:

   
                            open -a "Google Chrome" --args --allow-file-access-from-files
  

Remember to close all Chrome web sessions, otherwise it doesn't work!


B)Mozilla Firefox:

In Firefox, first you need to navigate to about:config in the Firefox browser, search for the privacy.file_unique_origin setting, and set it from true
to false.


----------------------------------------------------------------------------------------------------
Examples


<img width="1416" alt="Prima" src="https://user-images.githubusercontent.com/93512390/139704994-6e8f2780-d8f8-40bc-b239-898542b3e431.png">

<img width="1415" alt="Seconda" src="https://user-images.githubusercontent.com/93512390/139705074-95640e63-cb14-45f8-891a-e4170e357072.png">

<img width="1418" alt="Terza" src="https://user-images.githubusercontent.com/93512390/139707381-be85e8c9-0f04-48be-b38c-83af27587954.png">

<img width="1411" alt="Quarta" src="https://user-images.githubusercontent.com/93512390/139705307-911e924b-fc1b-4595-b289-337ec5310295.png">



----------------------------------------------------------------------------------------------------

References

[1]https://threejs.org/

[2]https://en.wikipedia.org/wiki/L-system

[3]https://www.carl-olsson.com/project/l-system/

[4]http://algorithmicbotany.org/papers/abop/abop-ch1.pdf

  



