/*
 * Copyright (C) 2020 CenturyLink, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.centurylink.mdw.image;

import com.centurylink.mdw.cli.Dependency;
import com.centurylink.mdw.constant.WorkAttributeConstant;
import com.centurylink.mdw.export.ProcessExporter;
import com.centurylink.mdw.model.project.Project;
import com.centurylink.mdw.model.workflow.Activity;
import com.centurylink.mdw.model.workflow.Process;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class PngProcessExporter implements ProcessExporter {

    private Project project;
    public PngProcessExporter(Project project) {
        this.project = project;
    }

    @Override
    public byte[] export(Process process) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(printImage(process), "png", baos);
        return baos.toByteArray();
    }

    protected BufferedImage printImage(Process process) {
        int margin = 72;
        Dimension size = getDiagramSize(process);
        BufferedImage image = new BufferedImage(size.width + margin, size.height + margin, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = image.createGraphics();
        g2d.setBackground(Color.WHITE);
        g2d.clearRect(0, 0, image.getWidth(), image.getHeight());

        ProcessCanvas canvas = new ProcessCanvas(project, process);
        canvas.prepare();
        Color bgsave = canvas.getBackground();
        canvas.paintComponent(g2d);
        canvas.setBackground(bgsave);
        canvas.dispose();
        g2d.dispose();
        return image;
    }

    public Dimension getDiagramSize(Process process) {
        int w = 0;
        int h = 0;
        java.util.List<Activity> activities = process.getActivities();
        for (Activity act : activities) {
            String[] attrs = act.getAttribute(WorkAttributeConstant.WORK_DISPLAY_INFO).split(",");
            w = getWidth(attrs, w);
            h = getHeight(attrs, h);
        }
        List<Process> subProcesses = process.getSubprocesses();
        for (Process subProc : subProcesses) {
            String[] attrs = subProc.getAttribute(WorkAttributeConstant.WORK_DISPLAY_INFO).split(",");
            w = getWidth(attrs, w);
            h = getHeight(attrs, h);
        }
        return new Dimension(w, h);
    }

    private int getWidth(String[] attrs, int w) {
        int localW = Integer.parseInt(attrs[0].substring(2)) + Integer.parseInt(attrs[2].substring(2));
        if (localW > w)
            w = localW;
        return w;
    }

    private int getHeight(String[] attrs, int h) {
        int localH = Integer.parseInt(attrs[1].substring(2)) + Integer.parseInt(attrs[3].substring(2));
        if (localH > h)
            h = localH;
        return h;
    }

    @Override
    public List<Dependency> getDependencies() {
        List<Dependency> dependencies = new ArrayList<>();
        dependencies.add(new Dependency("org/jetbrains/kotlin/kotlin-stdlib/1.2.61/kotlin-stdlib-1.2.61.jar", 12388L));
        dependencies.add(new Dependency("org/slf4j/slf4j-api/1.7.25/slf4j-api-1.7.25.jar", 41203L));
        return dependencies;
    }
}
