from subprocess import Popen
from datamodels.camera import OpenFaceDataPoint
import csv


class OpenFaceInstance:

    process = None
    out_filename = "data"
    out_dir = ".\datastreams\openface\processed"
    device_id = 0

    file = None
    reader = None
    current_data = []
    header_data = []

    def __init__(self, out_dir, out_filename, device_id):
        self.out_filename = out_filename
        self.out_dir = out_dir
        self.device_id = device_id

    def __init__(self):
        pass

    def startProcess(self):
        try:
            self.process = Popen("\".\datastreams\openface\\bin\FeatureExtraction.exe\"" +
                                 " -device " + str(self.device_id) +
                                 " -of " + "\"" + self.out_filename + "\"" +
                                 " -out_dir " + self.out_dir)
        except FileNotFoundError:
            self.process = None
            print(
                "Couldn't find the OpenFace binaries, make sure they are installed correctly.")

    def terminateProcess(self):
        if self.process:
            self.process.terminate()

    def startDataRead(self):
        try:
            self.file = open("./processed/data.csv", newline="")
            self.reader = csv.reader(self.file)
            self.header_data = next(self.reader)
        except FileNotFoundError:
            print("Couldn't find the OpenFace data files.")

    def stopDataRead(self):
        self.file.close()

    def readNextData(self):
        while True:
            try:
                row = next(self.reader)
                self.current_data.append(
                    OpenFaceDataPoint(self.header_data, row)
                )
                print(row[0])
            except StopIteration:
                break

    def getCurrentData(self):
        self.readNextData()
        return self.current_data

    def clearCurrentData(self):
        self.current_data.clear()
