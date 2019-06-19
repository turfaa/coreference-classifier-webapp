/*
Author: Muhammad Gilang Julian Suherik
 */
package id.turfa.parser;

import IndonesianNLP.IndonesianPhraseChunker;
import IndonesianNLP.TreeNode;
import id.turfa.model.Phrase;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.List;

public class CorpusParser {
    private static int npCount = 1;
    private Phrase phrase;
    private BufferedReader br;
    private BufferedWriter bw;

    public void rawToXML(String inputFile, String outputFile) throws Exception {
        BufferedReader reader = new BufferedReader(new FileReader(inputFile));
        BufferedWriter writer = new BufferedWriter(new FileWriter(outputFile));
        int lineCounter = 1;

        writer.write("<?xml version='1.0' encoding='UTF-8'?>\n\n");
        writer.write("<data>\n");

        String line;
        while ((line = reader.readLine()) != null) {
            IndonesianPhraseChunker chunker = new IndonesianPhraseChunker(line);
            chunker.extractPhrase();
            List<TreeNode> nodes = chunker.getPhraseTree();
            writer.write("<sentence id=\"" + lineCounter + "\">\n" + treeNodeToXml(nodes) + "\n</sentence>\n");

            lineCounter++;
        }

        writer.write("</data>");
        writer.close();
        reader.close();
    }

    public String treeNodeToXml(List<TreeNode> nodes) {
        StringBuilder builder = new StringBuilder();
        for (TreeNode node : nodes) {
            // tidak punya child
            if (node.getChildList() == null) {
                String phraseString = node.getPhrase().replace("&", "&amp;");
                if (phraseString.equals(",") || phraseString.equals("/") || phraseString.equals(".")) {
                    int idx = builder.lastIndexOf("\\");
                    if (idx != -1) {
                        builder.insert(idx, phraseString);
                    } else {
                        builder.append(phraseString);
                    }
                } else if ((node.getType().equals("NP") || node.getType().equals("PRP")) && !hasNPChild(node)) {
                    builder.append("<phrase type=\"np\" id=\"" + (CorpusParser.npCount++) + "\">");
                    builder.append(node.getPhrase().replace("&", "&amp;") + "\\" + node.getType() + " ");
                    builder.append("</phrase>");
                } else {
                    if (node.getType().equals("\"")) {
                        builder.append(node.getPhrase().replace("&", "&amp;") + "\\Z ");
                    } else {
                        builder.append(node.getPhrase().replace("&", "&amp;") + "\\" + node.getType() + " ");
                    }
                }
            } else {
                if ((node.getType().equals("NP") || node.getType().equals("PRP")) && !hasNPChild(node)) {
                    builder.append("<phrase type=\"np\" id=\"" + (CorpusParser.npCount++) + "\">");
                    builder.append(treeNodeToXml(node.getChildList()));
                    builder.append("</phrase>");
                } else {
                    builder.append(treeNodeToXml(node.getChildList()));
                }
            }
        }
        return builder.toString().replace(" <", "<");
    }

    public boolean hasNPChild(TreeNode node) {
        boolean found = false;
        if (node.getChildList() == null) {
            return false;
        } else {
            for (TreeNode child : node.getChildList()) {
                if (child.getType().equals("NP") || child.getType().equals("PRP") || hasNPChild(child)) {
                    found = true;
                    break;
                }
            }
        }
        return found;
    }

    public void neTaggedtoXML(String inputFile, String outputFile) throws Exception {
        br = new BufferedReader(new FileReader(inputFile));
        bw = new BufferedWriter(new FileWriter(outputFile));

        bw.write("<?xml version='1.0' encoding='UTF-8'?>\n\n");
        bw.write("<data>\n");

        String line;
        int lineCounter = 0;
        while ((line = br.readLine()) != null) {
            lineCounter++;
            process(line, 0, lineCounter);
        }

        bw.write("</data>");
        bw.close();
        br.close();
    }

    public void process(String str, int startIdx, int count) throws Exception {
        int idx1 = str.indexOf("(", startIdx) + 1;
        int idx2 = str.indexOf(" ", idx1);
        String tag = str.substring(idx1, idx2);
        idx1 = idx2 + 1;
        idx2 = getEndidx(str, idx1);
        phrase = new Phrase(str.substring(idx1, idx2), tag, true);
        String output = phrase.toString().replace(" <", "<");
        bw.write("<sentence id=\"" + count + "\">\n" + output + "\n</sentence>\n");
    }

    public int getEndidx(String str, int curIdx) {
        int counter = 1;
        int idx = curIdx;
        while (counter > 0) {
            if (str.charAt(idx) == '(')
                counter++;
            else if (str.charAt(idx) == ')')
                counter--;
            idx++;
        }
        return idx - 1;
    }
}