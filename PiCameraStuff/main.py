# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
from picamera import PiCamera
from time import sleep

def initCamera():
    return PiCamera()

camera = initCamera()
camera.color_effects = (128, 128)
camera.resolution = (2*1024, 2*768)
camera.iso = 100
camera.start_preview()
sleep(2)
camera.capture("image.jpg")
camera.stop_preview()
