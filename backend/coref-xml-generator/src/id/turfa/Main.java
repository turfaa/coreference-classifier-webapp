package id.turfa;

import IndonesianNLP.IndonesianNETagger;
import id.turfa.parser.CorpusParser;
import id.turfa.parser.XMLCorpusParser;

import java.io.File;

public class Main {

    public static void main(String[] args) throws Exception {
        if (args.length < 2) {
            System.out.println("Usage:\nArgument 1: input file.\nArgument 2: output file.");
            return;
        }
        String inputFile = args[0], outputFile = args[1];

        CorpusParser parser = new CorpusParser();
        parser.rawToXML(inputFile, outputFile + "tmp1.xml");

        XMLCorpusParser xmlParser = new XMLCorpusParser();
        xmlParser.completeXMLTag(outputFile + "tmp1.xml", outputFile + "tmp2.xml");
        xmlParser.getRawText(outputFile + "tmp2.xml", outputFile + "raw.txt");

        IndonesianNETagger neTagger = new IndonesianNETagger();
        neTagger.NETagFile(outputFile + "raw.txt", outputFile + "ne.txt");

        xmlParser.insertNETag(outputFile + "tmp2.xml", outputFile + "ne.txt", outputFile);

        String[] tmpFilePostfixes = {"tmp1.xml", "tmp2.xml", "raw.txt", "ne.txt"};
        for (String postfix : tmpFilePostfixes) {
            (new File(outputFile + postfix)).delete();
        }
    }
}
